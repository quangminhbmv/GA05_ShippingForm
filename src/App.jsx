import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import provincesData from "./data/provinces.json";
import wardsData from "./data/ward.json";

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [wards, setWards] = useState([]);

  const selectedProvince = watch("province");

  const provincesList = Object.values(provincesData || {}).map((p) => ({
    code: p.code,
    name: p.name || p.name_with_type || p.slug || p.code,
  }));

  // normalize wards data to array
  const wardsArray = Array.isArray(wardsData) ? wardsData : Object.values(wardsData || {});

  // Khi chọn tỉnh: lấy trực tiếp danh sách phường/xã thuộc tỉnh (match bằng parent_code hoặc path)
  useEffect(() => {
    if (!selectedProvince) {
      setWards([]);
      return;
    }
    const provinceCode = String(selectedProvince);
    const provinceName = provincesList.find((p) => String(p.code) === provinceCode)?.name || "";

    const matched = wardsArray
      .filter((w) => {
        const parent = String(w.parent_code ?? w.province_code ?? "").trim();
        if (parent === provinceCode) return true;
        const path = String(w.path_with_type ?? w.path ?? "");
        if (provinceName && path.includes(provinceName)) return true;
        return false;
      })
      .map((w) => ({
        code: String(w.code ?? w.ward_code ?? w.id ?? ""),
        name:
          w.name_with_type ??
          w.name ??
          w.ward_name ??
          w.path_with_type ??
          w.path ??
          String(w.code ?? w.ward_code ?? w.id ?? ""),
      }));

    // dedupe và sort theo tên
    const seen = new Set();
    const unique = [];
    for (const item of matched) {
      if (!item.code || seen.has(item.code)) continue;
      seen.add(item.code);
      unique.push(item);
    }
    unique.sort((a, b) => a.name.localeCompare(b.name, "vi"));

    setWards(unique);
  }, [selectedProvince, wardsArray, provincesList]);

  const onSubmit = (data) => {
    alert("Gửi thành công!");
    console.log(data);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📝 Enhanced Shipping Form
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Họ và tên</label>
            <input
              {...register("fullname", { required: "Họ tên là bắt buộc" })}
              type="text"
              className="input"
              placeholder="Nhập họ và tên"
            />
            {errors.fullname && (
              <p className="error">{errors.fullname.message}</p>
            )}
          </div>

          {/* Birthday */}
          <div>
            <label className="block font-medium mb-1">Ngày sinh</label>
            <input
              {...register("dob", {
                required: "Ngày sinh bắt buộc",
                validate: (value) => {
                  // Kiểm tra định dạng dd/mm/yyyy
                  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                    return "Định dạng phải là dd/mm/yyyy";
                  }
                  const [d, m, y] = value.split("/").map((v) => Number(v));
                  // kiểm tra month
                  if (m < 1 || m > 12) return "Tháng không hợp lệ";
                  // kiểm tra year (giữ reasonable range)
                  const currentYear = new Date().getFullYear();
                  if (y < 1900 || y > currentYear) return "Năm không hợp lệ";
                  // số ngày trong tháng (Date months: 0-11, dùng day 0 trick)
                  const daysInMonth = new Date(y, m, 0).getDate();
                  if (d < 1 || d > daysInMonth) return "Ngày không hợp lệ";
                  return true;
                },
              })}
              type="text"
              className="input"
              placeholder="dd/mm/yyyy"
            />
            {errors.dob && <p className="error">{errors.dob.message}</p>}
          </div>

          {/* CCCD */}
          <div>
            <label className="block font-medium mb-1">CCCD</label>
            <input
              {...register("cccd", {
                required: "Vui lòng nhập CCCD",
                minLength: { value: 12, message: "CCCD phải đủ 12 số" },
                maxLength: { value: 12, message: "CCCD phải đủ 12 số" },
              })}
              type="number"
              className="input"
              placeholder="123456789012"
            />
            {errors.cccd && <p className="error">{errors.cccd.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1">Số điện thoại</label>
            <input
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^0\d{9}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              type="text"
              className="input"
              placeholder="0123456789"
            />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Email không hợp lệ",
                },
              })}
              type="email"
              className="input"
              placeholder="email@example.com"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          {/* Address */}
          <h2 className="text-lg font-semibold text-gray-700 mt-6">
            Địa chỉ giao hàng
          </h2>

          {/* Street Number */}
          <div>
            <label className="block font-medium mb-1">Số nhà</label>
            <input
              {...register("streetNumber", { required: "Không được bỏ trống" })}
              type="text"
              className="input"
              placeholder="Ví dụ: 123"
            />
            {errors.streetNumber && (
              <p className="error">{errors.streetNumber.message}</p>
            )}
          </div>

          {/* Street Name */}
          <div>
            <label className="block font-medium mb-1">Tên đường</label>
            <input
              {...register("streetName", { required: "Không được bỏ trống" })}
              type="text"
              className="input"
              placeholder="Ví dụ: Nguyễn Trãi"
            />
            {errors.streetName && (
              <p className="error">{errors.streetName.message}</p>
            )}
          </div>

          {/* Province */}
          <div>
            <label className="block font-medium mb-1">Tỉnh / Thành phố</label>
            <select {...register("province", { required: "Chọn tỉnh/thành" })} className="input" defaultValue="">
              <option value="">-- Chọn tỉnh/thành --</option>
              {provincesList.map((p) => (
                <option key={p.code || p.name} value={p.code}>{p.name}</option>
              ))}
            </select>
            {errors.province && <p className="error">{errors.province.message}</p>}
          </div>

          {/* Ward */}
          {wards.length > 0 && (
            <div>
              <label className="block font-medium mb-1">Phường / Xã</label>
              <select {...register("ward", { required: "Chọn phường/xã" })} className="input" defaultValue="">
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>{w.name}</option>
                ))}
              </select>
              {errors.ward && <p className="error">{errors.ward.message}</p>}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition"
          >
            Gửi thông tin
          </button>
        </form>
      </div>
    </div>
  );
}
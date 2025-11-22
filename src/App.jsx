import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import provincesData from "./data/provinces.json";

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  // Load districts when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      return;
    }
    const province = provincesData.find((p) => p.name === selectedProvince);
    setDistricts(province?.districts || []);
    setWards([]);
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      return;
    }
    const district = districts.find((d) => d.name === selectedDistrict);
    setWards(district?.wards || []);
  }, [selectedDistrict, districts]);

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
              {...register("dob", { required: "Ngày sinh bắt buộc" })}
              type="date"
              className="input"
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
            <select {...register("province")} className="input">
              <option value="">-- Chọn tỉnh/thành --</option>
              {provincesData.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
            </select>
            {errors.province && <p className="error">{errors.province.message}</p>}
          </div>

          {/* District */}
          {districts.length > 0 && (
            <div>
              <label className="block font-medium mb-1">Quận / Huyện</label>
              <select {...register("district")} className="input">
                <option value="">-- Chọn quận/huyện --</option>
                {districts.map((d) => (
                  <option key={d.name}>{d.name}</option>
                ))}
              </select>
              {errors.district && (
                <p className="error">{errors.district.message}</p>
              )}
            </div>
          )}

          {/* Ward */}
          {wards.length > 0 && (
            <div>
              <label className="block font-medium mb-1">Phường / Xã</label>
              <select {...register("ward")} className="input">
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((w, idx) => (
                  <option key={idx}>{w}</option>
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

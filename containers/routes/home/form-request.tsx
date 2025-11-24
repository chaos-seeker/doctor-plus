'use client';

import { useId, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import { Sparkles, RotateCw } from 'lucide-react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import { DateObject } from 'react-multi-date-picker';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import toast from 'react-hot-toast';
import { supabaseClient } from '@/lib/supabase';
import { addRequest } from '@/actions/request/add-request';
import { getDoctors } from '@/actions/doctors/get-doctors';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { regex } from '@/constants/regex';
import 'react-multi-date-picker/styles/layouts/mobile.css';

const schema = z.object({
  first_name: z
    .string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .regex(regex.persian, 'نام باید با حروف فارسی نوشته شود'),
  last_name: z
    .string()
    .min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد')
    .regex(regex.persian, 'نام خانوادگی باید با حروف فارسی نوشته شود'),
  national_id: z
    .string()
    .min(10, 'کد ملی باید ۱۰ رقم باشد')
    .max(10, 'کد ملی باید ۱۰ رقم باشد')
    .regex(/^\d+$/, 'کد ملی باید فقط شامل اعداد باشد'),
  gender: z.enum(['male', 'female'], {
    message: 'جنسیت را انتخاب کنید',
  }),
  birth_date: z.string().min(1, 'تاریخ تولد الزامی است'),
  phone: z
    .string()
    .min(11, 'شماره تماس باید حداقل ۱۱ رقم باشد')
    .regex(/^\d+$/, 'شماره تماس باید فقط شامل اعداد باشد'),
  specialist: z.string().min(1, 'متخصص را انتخاب کنید'),
});

type RequestFormValues = z.infer<typeof schema>;

const genderOptions = [
  { value: 'male', label: 'مرد' },
  { value: 'female', label: 'زن' },
];

export function FormRequest() {
  const formId = useId();
  const [doctorQuery] = useQueryState('doctor', { defaultValue: '' });

  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });

  const doctorOptions = doctors.map((doctor) => ({
    value: doctor.full_name,
    label: doctor.full_name,
  }));

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      national_id: '',
      gender: undefined,
      birth_date: '',
      phone: '',
      specialist: '',
    },
  });

  // Set default specialist from query parameter
  useEffect(() => {
    if (doctorQuery && doctors.length > 0) {
      // Decode the query parameter (replace + with space)
      const decodedDoctor = decodeURIComponent(doctorQuery.replace(/\+/g, ' '));
      // Check if the doctor exists in the list
      const doctorExists = doctors.some(
        (doctor) => doctor.full_name === decodedDoctor,
      );
      if (doctorExists) {
        setValue('specialist', decodedDoctor);
      }
    }
  }, [doctorQuery, doctors, setValue]);

  const mutation = useMutation({
    mutationFn: async (values: RequestFormValues) => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      return addRequest({
        ...values,
        gender: values.gender,
        user_id: user?.id ?? null,
      });
    },
    onSuccess: () => {
      toast.success('درخواست نوبت با موفقیت ثبت شد');
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ثبت درخواست');
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    mutation.mutate(values);
  });

  return (
    <div className="container">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_0_rgba(158,158,158,.25)]">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">ثبت درخواست نوبت</h2>
        </div>

        <form id={formId} onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="first_name"
                className="text-sm font-medium text-gray-700"
              >
                نام
              </label>
              <Input id="first_name" {...register('first_name')} />
              {errors.first_name && (
                <p className="text-xs text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="text-sm font-medium text-gray-700"
              >
                نام خانوادگی
              </label>
              <Input id="last_name" {...register('last_name')} />
              {errors.last_name && (
                <p className="text-xs text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="national_id"
                className="text-sm font-medium text-gray-700"
              >
                کد ملی
              </label>
              <Input
                id="national_id"
                inputMode="numeric"
                {...register('national_id')}
              />
              {errors.national_id && (
                <p className="text-xs text-red-500">
                  {errors.national_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-gray-700"
              >
                جنسیت
              </label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={genderOptions}
                    placeholder="انتخاب کنید"
                  />
                )}
              />
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="birth_date"
                className="text-sm font-medium text-gray-700"
              >
                تاریخ تولد
              </label>
              <Controller
                control={control}
                name="birth_date"
                render={({ field }) => (
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={
                      field.value
                        ? new DateObject(new Date(field.value)).convert(
                            persian,
                            persian_fa,
                          )
                        : undefined
                    }
                    onChange={(date: DateObject | DateObject[] | null) => {
                      if (date && !Array.isArray(date)) {
                        // Convert Persian date to Gregorian (miladi) and save as ISO string
                        const gregorianDate = date.convert(
                          gregorian,
                          gregorian_en,
                        );
                        const dateString = gregorianDate
                          .toDate()
                          .toISOString()
                          .split('T')[0];
                        field.onChange(dateString);
                      } else {
                        field.onChange('');
                      }
                    }}
                    inputClass="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    containerClassName="w-full"
                    calendarPosition="bottom-right"
                    format="YYYY/MM/DD"
                    placeholder="تاریخ تولد را انتخاب کنید"
                  />
                )}
              />
              {errors.birth_date && (
                <p className="text-xs text-red-500">
                  {errors.birth_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                شماره تماس
              </label>
              <Input id="phone" inputMode="tel" {...register('phone')} />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="specialist"
              className="text-sm font-medium text-gray-700"
            >
              متخصص
            </label>
            <Controller
              control={control}
              name="specialist"
              render={({ field }) => (
                <Select
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={doctorOptions}
                  placeholder="متخصص را انتخاب کنید"
                />
              )}
            />
            {errors.specialist && (
              <p className="text-xs text-red-500">
                {errors.specialist.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              form={formId}
              disabled={isSubmitting || mutation.isPending}
              className="bg-primary hover:bg-primary/90 disabled:bg-primary/60 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed"
            >
              {isSubmitting || mutation.isPending ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>در حال ثبت...</span>
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4" />
                  <span>ثبت درخواست نوبت</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

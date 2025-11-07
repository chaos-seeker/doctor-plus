'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/modal';
import { useModal } from '@/hooks/modal';
import { addDoctor } from '@/actions/dashboard/doctors/add-doctor';
import { getCategories } from '@/actions/dashboard/categories/get-categories';
import { toSlug } from '@/utils/slug';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { regex } from '@/constants/regex';

const schema = z.object({
  full_name: z
    .string()
    .min(3, 'نام پزشک باید حداقل ۳ کاراکتر باشد')
    .regex(regex.persian, 'نام و نام خانوادگی باید با حروف فارسی نوشته شود'),
  slug: z
    .string()
    .min(3, 'اسلاگ باید حداقل ۳ کاراکتر باشد')
    .regex(regex.slug, 'اسلاگ باید با حروف انگلیسی و خط تیره باشد'),
  image: z.string().min(1, 'انتخاب تصویر الزامی است'),
  medical_code: z
    .string()
    .min(1, 'کد نظام پزشکی الزامی است')
    .regex(/^\d+$/, 'کد نظام پزشکی باید فقط شامل اعداد باشد'),
  description: z.string().optional(),
  documents: z.string().optional(),
  category_id: z.string().uuid('دسته‌بندی را انتخاب کنید'),
});

const defaultValues = {
  full_name: '',
  slug: '',
  image: '',
  medical_code: '',
  description: '',
  documents: '',
  category_id: '',
} satisfies z.input<typeof schema>;

type AddDoctorFormValues = z.infer<typeof schema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-xs text-red-500">{message}</p> : null;

const toDocumentList = (value?: string) =>
  value
    ? value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export function ModalAddDoctor() {
  const modal = useModal('add-doctor');
  const queryClient = useQueryClient();
  const formId = useId();
  const [preview, setPreview] = useState<string>('');
  const lastAutoSlug = useRef<string>('');

  const categoriesQuery = useQuery({
    queryKey: ['dashboard', 'manage-categories', 'list-options'],
    queryFn: getCategories,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm<AddDoctorFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const closeAndReset = useCallback(() => {
    reset(defaultValues);
    setPreview('');
    lastAutoSlug.current = '';
    modal.hide();
  }, [modal, reset]);

  const mutation = useMutation({
    mutationFn: (values: AddDoctorFormValues) =>
      addDoctor({
        full_name: values.full_name,
        slug: values.slug,
        image: values.image,
        medical_code: values.medical_code,
        description: values.description ?? '',
        documents: toDocumentList(values.documents),
        category_id: values.category_id,
      }),
    onSuccess: () => {
      toast.success('پزشک با موفقیت ایجاد شد');
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'manage-doctors', 'list'],
      });
      closeAndReset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ایجاد پزشک');
    },
  });

  const syncSlugWithName = useCallback(
    (name: string | undefined) => {
      if (getFieldState('slug').isDirty) return;

      const trimmed = (name ?? '').trim();
      if (!trimmed) {
        if (lastAutoSlug.current) {
          lastAutoSlug.current = '';
          setValue('slug', '', { shouldValidate: false, shouldDirty: false });
        }
        return;
      }

      if (!regex.persian.test(trimmed)) return;

      const generated = toSlug(trimmed);
      if (!generated || generated === lastAutoSlug.current) return;

      lastAutoSlug.current = generated;
      setValue('slug', generated, {
        shouldValidate: true,
        shouldDirty: false,
      });
    },
    [getFieldState, setValue],
  );

  const watchedName = watch('full_name');

  useEffect(() => {
    syncSlugWithName(watchedName);
  }, [watchedName, syncSlugWithName]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setValue('image', base64, { shouldValidate: true });
        setPreview(base64);
      };
      reader.readAsDataURL(file);
    },
    [setValue],
  );

  const categoryOptions = useMemo(
    () =>
      (categoriesQuery.data ?? []).map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categoriesQuery.data],
  );

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <Modal
      modalKey="add-doctor"
      title="افزودن پزشک"
      widthClass="max-w-3xl"
      onClose={closeAndReset}
      footer={
        <button
          type="submit"
          form={formId}
          className="bg-primary hover:bg-primary/90 disabled:bg-primary/60 flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'در حال ثبت...' : 'افزودن پزشک'}
        </button>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-3">
          <label className="hover:border-primary hover:bg-primary/5 flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {preview ? (
              <img
                src={preview}
                alt="پیش‌نمایش"
                className="h-40 w-full rounded-xl object-cover"
              />
            ) : (
              <span>انتخاب تصویر</span>
            )}
          </label>
          <FieldError message={errors.image?.message} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="full_name"
            className="text-sm font-medium text-gray-700"
          >
            نام و نام خانوادگی
          </label>
          <Input id="full_name" {...register('full_name')} />
          <FieldError message={errors.full_name?.message} />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-gray-700">
            اسلاگ
          </label>
          <Input id="slug" {...register('slug')} />
          <FieldError message={errors.slug?.message} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="medical_code"
            className="text-sm font-medium text-gray-700"
          >
            کد نظام پزشکی
          </label>
          <Input
            id="medical_code"
            inputMode="numeric"
            {...register('medical_code')}
          />
          <FieldError message={errors.medical_code?.message} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="category_id"
            className="text-sm font-medium text-gray-700"
          >
            دسته‌بندی
          </label>
          <Controller
            control={control}
            name="category_id"
            render={({ field }) => (
              <Select
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={categoriesQuery.isLoading}
                options={categoryOptions}
                placeholder="انتخاب دسته‌بندی"
              />
            )}
          />
          <FieldError message={errors.category_id?.message} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="documents"
            className="text-sm font-medium text-gray-700"
          >
            مدارک (هر خط یک مورد)
          </label>
          <Textarea id="documents" rows={4} {...register('documents')} />
          <FieldError message={errors.documents?.message} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            توضیحات
          </label>
          <Textarea id="description" rows={4} {...register('description')} />
          <FieldError message={errors.description?.message} />
        </div>

        <input type="hidden" {...register('image')} />
      </form>
    </Modal>
  );
}

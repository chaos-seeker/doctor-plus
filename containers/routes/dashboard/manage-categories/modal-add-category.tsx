'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/modal';
import { useModal } from '@/hooks/modal';
import { addCategory } from '@/actions/dashboard/manage-categories/add-category';
import { toSlug } from '@/utils/slug';
import { Input } from '@/components/input';
import { regex } from '@/constants/regex';

const schema = z.object({
  name: z
    .string()
    .min(3, 'نام باید حداقل ۳ کاراکتر باشد')
    .regex(regex.persian, 'نام باید با حروف فارسی نوشته شود'),
  slug: z
    .string()
    .min(3, 'اسلاگ باید حداقل ۳ کاراکتر باشد')
    .regex(regex.slug, 'اسلاگ باید با حروف انگلیسی و خط تیره باشد'),
});

const defaultValues = {
  name: '',
  slug: '',
} satisfies z.input<typeof schema>;

type AddCategoryFormValues = z.infer<typeof schema>;

type FieldErrorProps = {
  message?: string;
};

const FieldError = ({ message }: FieldErrorProps) =>
  message ? <p className="text-xs text-red-500">{message}</p> : null;

export function ModalAddCategory() {
  const modal = useModal('add-category');
  const queryClient = useQueryClient();
  const formId = useId();
  const lastAutoSlug = useRef<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm<AddCategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const closeAndReset = useCallback(() => {
    reset(defaultValues);
    lastAutoSlug.current = '';
    modal.hide();
  }, [modal, reset]);

  const mutation = useMutation({
    mutationFn: (values: AddCategoryFormValues) =>
      addCategory({
        name: values.name,
        slug: values.slug,
      }),
    onSuccess: () => {
      toast.success('دسته‌بندی با موفقیت ایجاد شد');
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'manage-categories', 'list'],
      });
      closeAndReset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ایجاد دسته‌بندی');
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

  const watchedName = watch('name');

  useEffect(() => {
    syncSlugWithName(watchedName);
  }, [watchedName, syncSlugWithName]);

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <Modal
      modalKey="add-category"
      title="افزودن دسته‌بندی"
      onClose={closeAndReset}
      footer={
        <button
          type="submit"
          form={formId}
          className="bg-primary hover:bg-primary/90 disabled:bg-primary/60 flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'در حال ثبت...' : 'افزودن دسته‌بندی'}
        </button>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            نام دسته‌بندی
          </label>
          <Input id="name" {...register('name')} />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-gray-700">
            اسلاگ
          </label>
          <Input id="slug" {...register('slug')} />
          <FieldError message={errors.slug?.message} />
        </div>
      </form>
    </Modal>
  );
}

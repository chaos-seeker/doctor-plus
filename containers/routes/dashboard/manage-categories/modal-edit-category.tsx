'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/modal';
import { useModal } from '@/hooks/modal';
import { getCategory } from '@/actions/dashboard/manage-categories/get-category';
import { updateCategory } from '@/actions/dashboard/manage-categories/update-category';
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

type EditCategoryFormValues = z.infer<typeof schema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-xs text-red-500">{message}</p> : null;

export function ModalEditCategory() {
  const modal = useModal('edit-category');
  const queryClient = useQueryClient();
  const formId = useId();
  const lastAutoSlug = useRef<string>('');
  const [categoryId, setCategoryId] = useQueryState('modal-edit-category-id', {
    defaultValue: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm<EditCategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const closeAndReset = useCallback(() => {
    reset(defaultValues);
    lastAutoSlug.current = '';
    setCategoryId('');
    modal.hide();
  }, [modal, reset, setCategoryId]);

  const detailQuery = useQuery({
    queryKey: ['dashboard', 'manage-categories', 'detail', categoryId],
    queryFn: () => getCategory(categoryId),
    enabled: modal.isShow && Boolean(categoryId),
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

  useEffect(() => {
    if (!modal.isShow || !categoryId) {
      return;
    }
    if (detailQuery.isFetching) return;

    const data = detailQuery.data;

    if (!data) {
      toast.error('دسته‌بندی یافت نشد');
      closeAndReset();
      return;
    }

    reset({
      name: data.name,
      slug: data.slug,
    });
    lastAutoSlug.current = data.slug ?? '';
  }, [modal.isShow, categoryId, detailQuery.data, detailQuery.isFetching, closeAndReset, reset]);

  const mutation = useMutation({
    mutationFn: (values: EditCategoryFormValues) =>
      updateCategory({
        id: categoryId,
        name: values.name,
        slug: values.slug,
      }),
    onSuccess: () => {
      toast.success('دسته‌بندی با موفقیت ویرایش شد');
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'manage-categories', 'list'] });
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'manage-categories', 'detail', categoryId],
      });
      closeAndReset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ویرایش دسته‌بندی');
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (!categoryId) return;
    mutation.mutate(values);
  });

  const isLoading = detailQuery.isFetching || !categoryId;
  const disableSubmit = mutation.isPending || isLoading;

  return (
    <Modal
      modalKey="edit-category"
      title="ویرایش دسته‌بندی"
      onClose={closeAndReset}
      footer={
        <button
          type="submit"
          form={formId}
          className="bg-primary hover:bg-primary/90 disabled:bg-primary/60 flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed"
          disabled={disableSubmit}
        >
          {mutation.isPending ? 'در حال بروزرسانی...' : 'ذخیره تغییرات'}
        </button>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-5">
        <fieldset disabled={isLoading} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="edit-category-name" className="text-sm font-medium text-gray-700">
              نام دسته‌بندی
            </label>
            <Input id="edit-category-name" {...register('name')} />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-category-slug" className="text-sm font-medium text-gray-700">
              اسلاگ
            </label>
            <Input id="edit-category-slug" {...register('slug')} />
            <FieldError message={errors.slug?.message} />
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}

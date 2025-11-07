import { ListCategories } from '@/containers/routes/dashboard/manage-categories/list-categories';
import { ModalAddCategory } from '@/containers/routes/dashboard/manage-categories/modal-add-category';

export default function ManageCategoriesPage() {
  return (
    <>
      <ListCategories />
      <ModalAddCategory />
    </>
  );
}

import { ListCategories } from '@/containers/routes/dashboard/manage-categories/list-categories';
import { ModalAddCategory } from '@/containers/routes/dashboard/manage-categories/modal-add-category';
import { ModalEditCategory } from '@/containers/routes/dashboard/manage-categories/modal-edit-category';

export default function Page() {
  return (
    <>
      <ListCategories />
      <ModalAddCategory />
      <ModalEditCategory />
    </>
  );
}

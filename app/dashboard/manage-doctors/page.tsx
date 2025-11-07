import { ListDoctors } from '@/containers/routes/dashboard/manage-doctors/list-doctors';
import { ModalAddDoctor } from '@/containers/routes/dashboard/manage-doctors/modal-add-doctor';
import { ModalEditDoctor } from '@/containers/routes/dashboard/manage-doctors/modal-edit-doctor';

export default function Page() {
  return (
    <>
      <ListDoctors />
      <ModalAddDoctor />
      <ModalEditDoctor />
    </>
  );
}

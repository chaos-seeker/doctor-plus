import { ListDoctors } from '@/containers/routes/dashboard/manage-doctors/list-doctors';
import { ModalAddDoctor } from '@/containers/routes/dashboard/manage-doctors/modal-add-doctor';

export default function ManageDoctorsPage() {
  return (
    <>
      <ListDoctors />
      <ModalAddDoctor />
    </>
  );
}

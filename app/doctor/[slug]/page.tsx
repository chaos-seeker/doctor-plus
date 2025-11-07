import { notFound } from 'next/navigation';
import { getDoctorBySlug } from '@/actions/dashboard/doctors/get-doctor-by-slug';
import { DoctorProfile } from '@/containers/routes/doctor/doctor-profile';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DoctorPage(props: PageProps) {
  const { slug } = await props.params;
  const doctor = await getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  return <DoctorProfile doctor={doctor} />;
}


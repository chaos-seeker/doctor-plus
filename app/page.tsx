import { Hero } from "@/containers/routes/home/hero";
import { ListDoctors } from "@/containers/home/list-doctors";
import { FormRequest } from "@/containers/routes/home/form-request";

export default function Page() {
  return (
    <>
    <Hero />
    <ListDoctors />
    </>
  );
}

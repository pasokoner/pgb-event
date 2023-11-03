import { SelectItem } from "@/components/ui/select";
import { api } from "@/trpc/react";

export default function OfficeItems() {
  const { data: offices } = api.office.getAcronyms.useQuery();

  return (
    <>
      {offices?.map((office) => (
        <SelectItem value={office.acronym} key={office.acronym}>
          {office.acronym}
        </SelectItem>
      ))}
    </>
  );
}

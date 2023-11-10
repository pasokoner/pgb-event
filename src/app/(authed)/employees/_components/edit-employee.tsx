import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type TEditEmployeeSchema, editEmployeeSchema } from "@/lib/types";
import { Employee, EmploymentStatus } from "@prisma/client";

import { api } from "@/trpc/react";
import { Loader2, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import OfficeItems from "./office-items";

type EditEmployee = {
  id: string;
};

export default function EditEmployee({ id }: EditEmployee) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data, isLoading, refetch } = api.employee.getById.useQuery(id, {
    enabled: open,
  });

  async function onSuccess() {
    setOpen(false);
    await refetch();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-2 sm:max-w-[620px] md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="flex w-full items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {data && <EditForm employee={data} onSuccess={onSuccess} />}
      </DialogContent>
    </Dialog>
  );
}

type EditFormProps = {
  employee: Employee;
  onSuccess: () => void;
};

const EditForm = ({ employee, onSuccess }: EditFormProps) => {
  const {
    mutate,
    isLoading: isUpdating,
    error,
  } = api.employee.update.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const form = useForm<TEditEmployeeSchema>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      id: employee.id,
      firstName: employee.firstName,
      middleName: employee.middleName ? employee.middleName : "",
      lastName: employee.lastName,
      extensionName: employee.extensionName ? employee.extensionName : "",
      position: employee.position ? employee.position : "",
      genericPosition: employee.genericPosition ? employee.genericPosition : "",
      employmentStatus: employee.employmentStatus
        ? employee.employmentStatus
        : "JOBORDER",
      officeAcronym: employee.officeAcronym ? employee.officeAcronym : "",
      officeAssignmentAcronym: employee.officeAssignmentAcronym
        ? employee.officeAssignmentAcronym
        : "",
    },
  });

  function onSubmit(data: TEditEmployeeSchema) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 py-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input placeholder="(optional)" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extensionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extension Name</FormLabel>
              <FormControl>
                <Input placeholder="(optional)" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genericPosition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Generic Position</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="officeAcronym"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Office (Mother Unit)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <OfficeItems />
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="officeAssignmentAcronym"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Office Assignment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <OfficeItems />
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {Object.keys(EmploymentStatus).map((status) => (
                    <SelectItem value={status} key={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm font-medium text-destructive">
            {error.message}
          </div>
        )}

        <Button disabled={isUpdating} type="submit" className="col-span-2">
          Save
        </Button>
      </form>
    </Form>
  );
};

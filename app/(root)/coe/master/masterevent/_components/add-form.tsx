"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputText } from "@/components/ui/extension/input-text";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMasterEventCoe } from "@/hooks/coe/usemMaster";
import { masterEventCoeSchema } from "@/schemas/coe/master";
import { saveMasterEvent } from "@/server/coe/masters/masterevent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { MasterEventCoe } from "@/types/coe/masterevent";
import { Form, FormField } from "@/components/ui/form";

type FormFields = z.infer<typeof masterEventCoeSchema.addOrUpdate>;

interface AddMasterEventCoeProps {
  onSuccess?: () => void;
  className?: string;
  initialData?: MasterEventCoe;
}

const PARAMETER_LIST = [
  { id: '1', name: '[NAME]' },
  { id: '2', name: '[INSTITUTENAME]' }
];

export default function AddMasterEventCoeForm({
  onSuccess,
  className = "",
  initialData
}: AddMasterEventCoeProps) {
  const { refetchAll } = useMasterEventCoe();

  const form = useForm<FormFields>({
    resolver: zodResolver(masterEventCoeSchema.addOrUpdate),
    mode: "onChange",
    defaultValues: {
      type: initialData ? (initialData.coemE_SMSMessage || initialData.coemE_Mail_Message ? 'mc' : 'dc') : 'mc',
      masterevent: initialData?.coemE_EventName || '',
      masterDescription: initialData?.coemE_EventDesc || '',
      smsContent: initialData?.coemE_SMSMessage || '',
      smsparameter: '',
      emailSubject: initialData?.coemE_MailSubject || '',
      emailHeader: initialData?.coemE_MailHeader || '',
      emailFooter: initialData?.coemE_MailFooter || '',
      emailMessage: initialData?.coemE_Mail_Message || '',
      eemailParamter: initialData?.coemE_MailHTMLTemplate || '',
    },
  });

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors, isSubmitting } } = form;
  const filterType = watch('type');

  useEffect(() => {
    if (initialData) {
      form.reset({
        type: (initialData.coemE_SMSMessage || initialData.coemE_Mail_Message) ? 'mc' : 'dc',
        masterevent: initialData.coemE_EventName || '',
        masterDescription: initialData.coemE_EventDesc || '',
        smsContent: initialData.coemE_SMSMessage || '',
        smsparameter: '',
        emailSubject: initialData.coemE_MailSubject || '',
        emailHeader: initialData.coemE_MailHeader || '',
        emailFooter: initialData.coemE_MailFooter || '',
        emailMessage: initialData.coemE_Mail_Message || '',
        eemailParamter: initialData.coemE_MailHTMLTemplate || '',
      });
    }
  }, [initialData, form]);

  const appendToContent = (fieldName: 'smsContent' | 'emailMessage', param: string) => {
    const current = watch(fieldName) || '';
    setValue(fieldName, current + param, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const payload = {
        coemE_Id: initialData?.coemE_Id || 0,
        mI_Id: 0,
        coemE_EventName: data.masterevent,
        coemE_EventDesc: data.masterDescription,
        coemE_SMSMessage: data.type === 'mc' ? data.smsContent || '' : '',
        coemE_MailSubject: data.emailSubject,
        coemE_MailHeader: data.emailHeader,
        coemE_MailFooter: data.emailFooter,
        coemE_Mail_Message: data.type === 'mc' ? data.emailMessage || '' : '',
        coemE_MailHTMLTemplate: data.eemailParamter || '',
        coemE_ActiveFlag: initialData?.coemE_ActiveFlag ?? true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        coemE_CCemailId: "",
        coemE_BCCemailId: "",
        coemE_CreatedBy: 0,
        coemE_UpdatedBy: 0,
        coemecaT_Id: 0,
      };

      const response = await saveMasterEvent(payload);
      if (response.success) {
        toast.success(response.message || "Master Event saved successfully");
        reset();
        refetchAll();
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to save Master Event");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const handleReset = () => reset();

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Card className="p-4">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mc" id="mc" />
                      <Label htmlFor="mc" className="cursor-pointer">Manual Content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dc" id="dc" />
                      <Label htmlFor="dc" className="cursor-pointer">Default Content</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputText
                label="Event Name"
                required
                placeholder="Enter Event Name"
                {...register("masterevent")}
                error={errors.masterevent?.message}
              />
              <InputText
                label="Event Description"
                required
                placeholder="Enter Event Description"
                {...register("masterDescription")}
                error={errors.masterDescription?.message}
              />
            </div>

            {filterType === "mc" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smsContent" className="text-destructive-foreground">SMS Content *</Label>
                  <Textarea
                    id="smsContent"
                    placeholder="Enter SMS Content"
                    {...register("smsContent")}
                    className={errors.smsContent ? "border-destructive" : ""}
                  />
                  {errors.smsContent && <p className="text-sm text-destructive">{errors.smsContent.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>SMS Parameter</Label>
                  <Select onValueChange={(val) => appendToContent('smsContent', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Parameter" />
                    </SelectTrigger>
                    <SelectContent>
                      {PARAMETER_LIST.map(p => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputText
                label="Email Subject"
                required
                placeholder="Enter Email Subject"
                {...register("emailSubject")}
                error={errors.emailSubject?.message}
              />
              <InputText
                label="Email Header"
                required
                placeholder="Enter Email Header"
                {...register("emailHeader")}
                error={errors.emailHeader?.message}
              />
            </div>

            {filterType === "mc" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emailMessage" className="text-destructive-foreground">Email Message *</Label>
                  <Textarea
                    id="emailMessage"
                    placeholder="Enter Email Message"
                    {...register("emailMessage")}
                    className={errors.emailMessage ? "border-destructive" : ""}
                  />
                  {errors.emailMessage && <p className="text-sm text-destructive">{errors.emailMessage.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Email Parameter</Label>
                  <Select onValueChange={(val) => appendToContent('emailMessage', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Parameter" />
                    </SelectTrigger>
                    <SelectContent>
                      {PARAMETER_LIST.map(p => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputText
                label="Email Footer"
                required
                placeholder="Enter Email Footer"
                {...register("emailFooter")}
                error={errors.emailFooter?.message}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
              className="order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2"
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              <div className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Master Event
              </div>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

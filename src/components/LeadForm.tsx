"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { siteFacts } from "@/content/site-facts";
import { trackEvent } from "@/lib/analytics";

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя"),
  company: z.string().trim().min(2, "Укажите компанию"),
  phone: z.string().trim().min(7, "Укажите телефон"),
  email: z.string().trim().email("Проверьте e-mail"),
  direction: z.string().min(1, "Выберите направление"),
  volume: z.string().trim().optional(),
  comment: z.string().trim().max(2000, "Не более 2000 знаков").optional(),
  consent: z.boolean().refine(Boolean, "Нужно согласие на обработку данных"),
  samples: z.boolean().optional(),
  website: z.string().max(0).optional(),
});

type LeadValues = z.infer<typeof schema>;
const allowedExtensions = ["pdf", "dwg", "dxf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "zip"];
const maxFileSize = 10 * 1024 * 1024;

export function LeadForm() {
  const started = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", company: "", phone: "", email: "", direction: "", volume: "", comment: "", consent: false, samples: false, website: "" },
  });

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("lead_form_start");
  };

  const onFile = (next?: File) => {
    setFileError("");
    if (!next) { setFile(null); return; }
    const extension = next.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowedExtensions.includes(extension)) { setFileError(`Допустимы: ${allowedExtensions.join(", ")}`); return; }
    if (next.size > maxFileSize) { setFileError("Файл должен быть не больше 10 МБ"); return; }
    setFile(next);
    trackEvent("lead_file_attached", { extension, size_kb: Math.round(next.size / 1024) });
  };

  const submit = async (values: LeadValues) => {
    setServerMessage(null);
    if (fileError) return;
    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => body.append(key, String(value ?? "")));
    if (file) body.append("attachment", file);

    try {
      const response = await fetch("/api/lead", { method: "POST", body });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message || "Не удалось отправить заявку");
      setServerMessage({ type: "success", text: data.message || "Заявка отправлена. Менеджер свяжется с вами." });
      trackEvent("lead_submit_success", { has_file: Boolean(file), samples: Boolean(values.samples) });
      reset();
      setFile(null);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Не удалось отправить заявку";
      setServerMessage({ type: "error", text: `${text}. Позвоните ${siteFacts.phoneDisplay} или напишите ${siteFacts.email}.` });
      trackEvent("lead_submit_error", { has_file: Boolean(file) });
    }
  };

  return (
    <section className="lead-section" id="contact" data-testid="lead-form-section">
      <div className="lead-intro"><span>14 / ВАШ ПРОЕКТ</span><h2>Расскажите о задаче — подберём HPL под проект</h2><p>Укажите назначение, объём, толщину и желаемую поверхность. Можно приложить спецификацию, чертёж или техническое задание.</p><div className="lead-contacts"><a href={siteFacts.phoneHref} onClick={() => trackEvent("phone_click", { placement: "lead" })}>{siteFacts.phoneDisplay}</a><a href={`mailto:${siteFacts.email}`} onClick={() => trackEvent("email_click", { placement: "lead" })}>{siteFacts.email}</a><span>{siteFacts.hours}</span><address>{siteFacts.address}</address></div></div>
      <form className="lead-form" id="lead-form" onSubmit={handleSubmit(submit)} onFocus={markStarted} noValidate>
        <div className="form-grid">
          <Field label="Имя" error={errors.name?.message}><input autoComplete="name" {...register("name")} aria-invalid={Boolean(errors.name)} /></Field>
          <Field label="Компания" error={errors.company?.message}><input autoComplete="organization" {...register("company")} aria-invalid={Boolean(errors.company)} /></Field>
          <Field label="Телефон" error={errors.phone?.message}><input type="tel" autoComplete="tel" {...register("phone")} aria-invalid={Boolean(errors.phone)} /></Field>
          <Field label="E-mail" error={errors.email?.message}><input type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} /></Field>
          <Field label="Направление проекта" error={errors.direction?.message}><select {...register("direction")} defaultValue="" aria-invalid={Boolean(errors.direction)}><option value="" disabled>Выберите направление</option><option>Мебельное производство</option><option>Строительство и интерьеры</option><option>Фасады</option><option>Чистые помещения</option><option>Транспорт</option><option>МАФ и городская среда</option><option>Другое</option></select></Field>
          <Field label="Ориентировочный объём" error={errors.volume?.message}><input placeholder="м² или количество листов" {...register("volume")} /></Field>
        </div>
        <Field label="Комментарий" error={errors.comment?.message}><textarea rows={5} placeholder="Толщина, формат, декор, требования к материалу" {...register("comment")} /></Field>
        <div className="file-control"><label htmlFor="attachment"><span>{file ? file.name : "Прикрепить ТЗ или чертёж"}</span><small>PDF, DWG, DXF, DOC, XLS, JPG, PNG, ZIP — до 10 МБ</small></label><input id="attachment" type="file" accept=".pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip" onChange={(event) => onFile(event.currentTarget.files?.[0])} />{file ? <button type="button" onClick={() => onFile()}>Удалить</button> : null}{fileError ? <p role="alert">{fileError}</p> : null}</div>
        <label className="check-row"><input type="checkbox" {...register("samples")} /><span>Нужны физические образцы</span></label>
        <label className="check-row"><input type="checkbox" {...register("consent")} aria-invalid={Boolean(errors.consent)} /><span>Согласен на обработку персональных данных и с <a href={siteFacts.privacyUrl}>политикой конфиденциальности</a></span></label>
        {errors.consent ? <p className="field-error" role="alert">{errors.consent.message}</p> : null}
        <div className="honeypot" aria-hidden="true"><label>Ваш сайт<input tabIndex={-1} autoComplete="off" {...register("website")} /></label></div>
        <button className="button button-primary submit-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Отправляем…" : "Получить расчёт"}<span aria-hidden="true">→</span></button>
        {serverMessage ? <p className={`form-status ${serverMessage.type}`} role="status">{serverMessage.text}</p> : null}
      </form>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span>{children}{error ? <small className="field-error">{error}</small> : null}</label>;
}

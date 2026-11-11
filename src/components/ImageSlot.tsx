import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  deleteImage,
  getImage,
  putImage,
} from "../lib/imageStore";
import { cairoDate } from "../lib/store";
/** A browser-local image slot. Shows a clean placeholder until the owner adds an image. */
export function ImageSlot({
  slotKey,
  title,
  placeholder,
  variant = "inline",
  overlay,
}: {
  slotKey: string;
  title: string;
  placeholder: string;
  variant?: "inline" | "full";
  overlay?: ReactNode;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ name: string; date: string } | null>(null);
  const [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    getImage(slotKey)
      .then((v) => {
        if (!active || !v) return;
        objectUrl = URL.createObjectURL(v.blob);
        setUrl(objectUrl);
        setMeta({ name: v.name, date: v.date });
      })
      .catch(
        () =>
          active &&
          setMessage("Local image storage is unavailable in this browser."),
      );
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [slotKey]);
  const choose = () => input.current?.click();
  const save = async (file: File) => {
    if (!IMAGE_TYPES.includes(file.type))
      return setMessage("Use a PNG, JPEG or WebP image.");
    if (file.size > MAX_IMAGE_BYTES)
      return setMessage("Image too large: maximum 15 MB.");
    try {
      const date = new Date().toISOString();
      await putImage(slotKey, { blob: file, name: file.name, date });
      if (url) URL.revokeObjectURL(url);
      setUrl(URL.createObjectURL(file));
      setMeta({ name: file.name, date });
      setMessage("Image saved on this device.");
    } catch {
      setMessage("The image could not be stored in this browser.");
    }
  };
  const remove = async () => {
    try {
      await deleteImage(slotKey);
      if (url) URL.revokeObjectURL(url);
      setUrl(null);
      setMeta(null);
      setMessage("Image removed from this device.");
    } catch {
      setMessage("The image could not be removed.");
    }
  };
  return (
    <figure
      className={`image-slot ${variant} ${url ? "filled" : "empty"}`}
      data-slot={slotKey}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) void save(f);
      }}
    >
      <div className="image-slot-frame">
        {url ? (
          <img src={url} alt={title} />
        ) : (
          <div className="image-slot-empty">
            <span>{placeholder}</span>
            <small>
              Drop an image here or use “Add image”. Stored on this device only.
            </small>
          </div>
        )}
        {url && overlay}
      </div>
      <figcaption>
        <b>{title}</b>
        {meta && (
          <small>
            {meta.name} · added {cairoDate(meta.date)} · stored in this browser,
            not in JSON export
          </small>
        )}
        <span className="image-slot-actions">
          <button type="button" onClick={choose}>
            {url ? <RefreshCw size={13} /> : <ImagePlus size={13} />}
            {url ? "Replace image" : "Add image"}
          </button>
          {url && (
            <button type="button" onClick={() => void remove()}>
              <Trash2 size={13} />
              Remove
            </button>
          )}
        </span>
        <input
          ref={input}
          hidden
          type="file"
          accept={IMAGE_TYPES.join(",")}
          aria-label={`${title} image file`}
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void save(f);
          }}
        />
        {message && (
          <small role="status" className="cyan">
            {message}
          </small>
        )}
      </figcaption>
    </figure>
  );
}

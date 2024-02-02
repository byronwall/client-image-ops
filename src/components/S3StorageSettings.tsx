import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { type S3StoreData, useS3Storage } from "~/stores/useS3Storage";

export function S3StorageSettings() {
  const {
    accessKeyId,
    bucket,
    loadFromLocalStorage,
    endPoint,
    port,
    secretAccessKey,
    updateSettings,
  } = useS3Storage();

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const { register, handleSubmit, setValue } = useForm<S3StoreData>({
    defaultValues: {
      accessKeyId,
      bucket,
      secretAccessKey,
      endPoint,
      port,
    },
  });

  useEffect(() => {
    // update form values if anything new comes from store
    setValue("accessKeyId", accessKeyId);
    setValue("bucket", bucket);
    setValue("secretAccessKey", secretAccessKey);
    setValue("endPoint", endPoint);
    setValue("port", port);
  }, [accessKeyId, bucket, endPoint, port, secretAccessKey, setValue]);

  return (
    <div className="flex flex-col gap-2 rounded-md p-4 bg-gray-100 max-w-lg">
      <h2 className="text-2xl font-bold">S3 Storage</h2>

      <p>
        Settings stored in local storage. Allows you to upload images to S3 and
        get a presigned URL back. Avoids data URLs which some tools don't like.
      </p>

      <div className="flex flex-col gap-2">
        <form
          onSubmit={handleSubmit(updateSettings)}
          className="flex flex-col gap-1"
        >
          <label>
            <span>Endpoint</span>
            <input
              type="text"
              {...register("endPoint")}
              placeholder="endPoint"
            />
          </label>

          <label>
            <span>Port</span>
            <input type="number" {...register("port")} placeholder="port" />
          </label>

          <label>
            <span>Bucket</span>
            <input type="text" {...register("bucket")} placeholder="bucket" />
          </label>

          <label>
            <span>Access Key</span>
            <input
              type="text"
              {...register("accessKeyId")}
              placeholder="accessKeyId"
            />
          </label>

          <label>
            <span>Secret Key</span>
            <input
              type="text"
              {...register("secretAccessKey")}
              placeholder="secretAccessKey"
            />
          </label>

          <button className="btn" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

import { Buffer } from "buffer";

import { create } from "zustand";
import * as Minio from "minio";

import { convertBase64ToUInt8Array } from "~/utils/buffers";

export type S3StoreData = {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endPoint: string;
  port: string;
};

type PresignedUrl = string;

type S3StoreActions = {
  updateSettings: (settings: S3StoreData) => void;

  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;

  saveImage: (base64data: string) => Promise<PresignedUrl>;

  getCanSaveImage: () => boolean;
};

// create zustand store
export const useS3Storage = create<S3StoreData & S3StoreActions>(
  (set, get) => ({
    accessKeyId: "",
    secretAccessKey: "",

    bucket: "",
    endPoint: "",
    port: "9000",

    getCanSaveImage: () => {
      const { accessKeyId, secretAccessKey, bucket, endPoint, port } = get();

      if (accessKeyId && secretAccessKey && bucket && endPoint && port) {
        return true;
      }

      return false;
    },

    updateSettings: (settings) => {
      set(settings);

      // save to local storage
      get().saveToLocalStorage();
    },
    loadFromLocalStorage: () => {
      const data = localStorage.getItem("s3Settings");
      console.log("data", data);
      if (data) {
        set(JSON.parse(data));
      }
    },
    saveToLocalStorage: () => {
      localStorage.setItem("s3Settings", JSON.stringify(get()));
    },

    saveImage: async (base64Data) => {
      // do something with the image
      // Initialize MinIO client

      const { accessKeyId, secretAccessKey, bucket, endPoint, port } = get();

      // Initialize MinIO client
      const minioClient = new Minio.Client({
        endPoint,
        port: parseInt(port),
        useSSL: true,
        accessKey: accessKeyId,
        secretKey: secretAccessKey,
      });

      const metaData = {
        "Content-Type": "application/octet-stream",
        "X-Amz-Meta-Testing": 1234,
        example: 5678,
      };

      // create random name `image-${Date.now()}.jpg`
      const fileType = base64Data.split(";")[0].split("/")[1];
      const objectName = `image-${Date.now()}.${fileType}`;

      const uintArr = convertBase64ToUInt8Array(base64Data);
      const buffer = Buffer.from(uintArr);

      const result = await minioClient.putObject(
        bucket,
        objectName,
        buffer,
        metaData
      );

      // now get a presigned URL for the object
      const url = await minioClient.presignedGetObject(
        bucket,
        objectName,
        24 * 60 * 60
      );

      console.log("result", result, url);

      return url;
    },
  })
);

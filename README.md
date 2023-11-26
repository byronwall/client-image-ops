# Client Image Operations

A simple client interface to take a wide variety of image formats and get to common formats. The goal is to handle drag/drop and copy/paste from as many sources as possible. The end goal is a base64 image that can be downloaded.

## Formats supported

Formats:

- PNG
- JPEG
- HEIC - common for macOS images and iMessage

## Import methods supports

Methods:

- Drag and drop
  - Drag an image
  - Drag an HTML element containing an image
- Copy and paste
  - Copy an image
  - Copy an "image" from Teams
  - Copy HTML containing a URL to an image
- Import from text
  - base64

## Stack

Contains:

- Vite
- react-ts
- eslint rules around imports
- TailwindCSS
- Github actions to build pages
- NextUI for components

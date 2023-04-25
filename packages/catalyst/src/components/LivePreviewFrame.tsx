"use client";

import { useEffect, useRef } from "react";
import wretch from "wretch";
import { useDebounce } from "./hooks/useDebounce";

type Props = {
  url: string;
  data: any;
  collectionName: string;
};

export const LivePreviewFrame: React.FC<Props> = (props) => {
  const ref = useRef<HTMLIFrameElement>(null);

  const debouncedData = useDebounce(props.data, 500);

  useEffect(() => {
    wretch(props.url)
      .headers({
        [`x-catalyst-live-preview-${props.collectionName}`]:
          JSON.stringify(debouncedData),
      })
      .get()
      .text()
      .then((data) => {
        // @ts-ignore
        ref.current.contentWindow.contents = data;
        // @ts-ignore
        ref.current.src = 'javascript:window["contents"]';
      });
  }, [props.url, debouncedData]);

  return (
    <div className="w-full flex justify-center items-center p-16 border-l border-gray-300">
      <iframe
        src={props.url}
        ref={ref}
        className="w-full h-full border border-gray-300 rounded overflow-hidden"
      />
    </div>
  );
};

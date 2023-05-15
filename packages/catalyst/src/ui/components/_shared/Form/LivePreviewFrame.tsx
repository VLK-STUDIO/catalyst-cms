"use client";

import { useEffect, useRef } from "react";
import wretch from "wretch";
import { useDebounce } from "../../../hooks/useDebounce";

type Props = {
  url: string;
  data: any;
  typeName: string;
};

export const LivePreviewFrame: React.FC<Props> = props => {
  const ref = useRef<HTMLIFrameElement>(null);

  const debouncedData = useDebounce(props.data, 500);

  useEffect(() => {
    wretch(props.url)
      .headers({
        [`x-catalyst-live-preview-${props.typeName}`]: encodeURIComponent(
          JSON.stringify(debouncedData)
        )
      })
      .get()
      .text()
      .then(data => {
        // @ts-ignore
        ref.current.contentWindow.contents = data;
        // @ts-ignore
        ref.current.src = 'javascript:window["contents"]';
      });
  }, [props.url, debouncedData]);

  return (
    <div className="flex w-full items-center justify-center border-l border-gray-300 bg-white p-16">
      <iframe
        src={props.url}
        ref={ref}
        className="h-full w-full overflow-hidden rounded border border-gray-300"
      />
    </div>
  );
};

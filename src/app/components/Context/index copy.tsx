import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { urls } from "./urls";
import UrlButton from "./UrlButton";
import { Card, ICard } from "./Card";
import { clearIndex, crawlDocument, loadYoutube } from "./utils";
import { Button } from "./Button";

interface ContextProps {
  className: string;
  selected: string[] | null;
}

export const Context: React.FC<ContextProps> = ({ className, selected }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);

  const [splittingMethod, setSplittingMethod] = useState("markdown");
  const [chunkSize, setChunkSize] = useState(256);
  const [overlap, setOverlap] = useState(1);
  const [youtubeUrl, setYoutubeUrl] = useState(""); // State to store YouTube URL

  useEffect(() => {
    const element = selected && document.getElementById(selected[0]);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  const handleYoutubeUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
  };

  const handleYoutubeUrlSubmit = useCallback(() => {
    // Here you can perform any necessary validation or processing of the YouTube URL
    // For simplicity, let's just add it to the list of entries for now
    setEntries([...entries, { url: youtubeUrl, loading: true }]);
    crawlDocument(
      youtubeUrl,
      setEntries,
      setCards,
      splittingMethod,
      chunkSize,
      overlap
    );
    setYoutubeUrl(""); // Clear the input field after submission
  }, [youtubeUrl, entries, splittingMethod, chunkSize, overlap]);

  const buttons = entries.map((entry, key) => (
    <div className="" key={`${key}-${entry.loading}`}>
      <UrlButton
        entry={entry}
        onClick={() =>
          crawlDocument(
            entry.url,
            setEntries,
            setCards,
            splittingMethod,
            chunkSize,
            overlap
          )
        }
      />
    </div>
  ));

  return (
    <div
      className={`flex flex-col border-2 overflow-y-auto rounded-lg border-gray-500 w-full ${className}`}
    >
      <div className="flex flex-col items-start sticky top-0 w-full">
        <div className="flex flex-col items-start lg:flex-row w-full lg:flex-wrap p-2">
          {buttons}
          {/* Form for entering YouTube URL */}
          <div  className="flex-grow w-full px-4">
            <input
              type="text"
              className="input-glow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:shadow-outline pl-3 pr-10 bg-gray-600 border-gray-600 transition-shadow duration-200"

              value={youtubeUrl}
              onChange={handleYoutubeUrlChange}
              placeholder="Enter YouTube URL"
            />
            <Button
            className="w-full my-2 uppercase active:scale-[98%] transition-transform duration-100"
            style={{
              backgroundColor: "#4f6574",
              color: "white",
            }}
            onClick={handleYoutubeUrlSubmit}
          >
           Add YouTube URL
          </Button>

          </div>
        </div>
        <div className="flex-grow w-full px-4">
          <Button
            className="w-full my-2 uppercase active:scale-[98%] transition-transform duration-100"
            style={{
              backgroundColor: "#4f6574",
              color: "white",
            }}
            onClick={() => clearIndex(setEntries, setCards)}
          >
            Clear Index
          </Button>
        </div>
        <div className="flex p-2"></div>
        {/* Dropdown for splitting method */}
        <div className="text-left w-full flex flex-col rounded-b-lg bg-gray-600 p-3 subpixel-antialiased">
          <label htmlFor="splittingMethod" className="text-white p-2 font-bold">
            Splitting Method:
          </label>
          <div className="relative w-full">
            <select
              id="splittingMethod"
              value={splittingMethod}
              className="p-2 bg-gray-700 rounded text-white w-full appearance-none hover:cursor-pointer"
              onChange={(e) => setSplittingMethod(e.target.value)}
            >
              <option value="recursive">Recursive Text Splitting</option>
              <option value="markdown">Markdown Splitting</option>
            </select>
          </div>
          {splittingMethod === "recursive" && (
            <div className="my-4 flex flex-col">
              <div className="flex flex-col w-full">
                <label htmlFor="chunkSize" className="text-white p-2 font-bold">
                  Chunk Size: {chunkSize}
                </label>
                <input
                  className="p-2 bg-gray-700"
                  type="range"
                  id="chunkSize"
                  min={1}
                  max={2048}
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="overlap" className="text-white p-2 font-bold">
                  Overlap: {overlap}
                </label>
                <input
                  className="p-2 bg-gray-700"
                  type="range"
                  id="overlap"
                  min={1}
                  max={200}
                  value={overlap}
                  onChange={(e) => setOverlap(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap w-full">
        {cards &&
          cards.map((card, key) => (
            <Card key={key} card={card} selected={selected} />
          ))}
      </div>
    </div>
  );
};

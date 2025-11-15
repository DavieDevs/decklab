import type { FC } from "react";
import type { Card } from "../types/deck";

type CardDetailModalProps = {
  card: Card;
  onClose: () => void;
};

export const CardDetailModal: FC<CardDetailModalProps> = ({
  card,
  onClose,
}) => {
  const img = card.fullImageUrl || card.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[90%] max-w-sm max-h-[85vh] rounded-lg border border-neutral-700 bg-neutral-900 p-4 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="mr-4 text-base font-semibold text-neutral-100">
            {card.name}
          </h2>
          <button
            onClick={onClose}
            className="text-sm text-neutral-400 hover:text-neutral-100"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* Image */}
          {img && (
            <img
              src={img}
              alt={card.name}
              className="mb-3 w-full max-h-64 rounded-md object-contain shadow-lg"
            />
          )}

          {/* Type / attribute / level / stats */}
          <div className="mb-2 space-y-1 text-xs text-neutral-300">
            {card.type && <p>{card.type}</p>}

            {(card.attribute || card.level) && (
              <p>
                {card.attribute && (
                  <span className="mr-2">
                    <strong>Attribute:</strong> {card.attribute}
                  </span>
                )}
                {card.level && (
                  <span>
                    <strong>Level:</strong> {card.level}
                  </span>
                )}
              </p>
            )}

            {card.atk !== undefined && card.def !== undefined && (
              <p>
                <strong>ATK:</strong> {card.atk} &nbsp; | &nbsp;
                <strong>DEF:</strong> {card.def}
              </p>
            )}
          </div>

          {/* Description */}
          {card.desc && (
            <p className="mb-3 whitespace-pre-line text-sm text-neutral-200">
              {card.desc}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-neutral-800 px-3 py-1.5 text-sm text-neutral-100 hover:bg-neutral-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

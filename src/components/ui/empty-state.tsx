import Image from 'next/image';

interface Props {
  imageUrl: string;
  alt: string;
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}

/**
 * Empty state component with illustration.
 */
export default function EmptyState({ imageUrl, alt, message, ctaLabel, onCta }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <Image src={imageUrl} alt={alt} width={400} height={300} className="rounded" />
      <p className="text-center text-gray-600 max-w-md">{message}</p>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="bg-primary text-secondary px-6 py-2 rounded hover:bg-primary/90 transition"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

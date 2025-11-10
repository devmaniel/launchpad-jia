export default function AvatarImage({
  src,
  className,
  alt = "Avatar",
  title,
  style,
  isActive = false,
}: {
  src: string;
  className?: string;
  alt?: string;
  title?: string;
  style?: React.CSSProperties;
  isActive?: boolean;
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={src}
        alt={alt}
        title={title}
        className={`avatar rounded-circle ${className}`}
        onError={(e: any) => {
          e.target.src = `https://api.dicebear.com/9.x/glass/svg?seed=${Date.now()}`;
        }}
        style={{
          flexShrink: 0,
          border: isActive ? '2px solid #fff' : 'none',
          ...style,
        }}
      />
      {isActive && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '14px',
            height: '14px',
            backgroundColor: '#12B76A',
            borderRadius: '50%',
            border: '3px solid #fff',
          }}
        />
      )}
    </div>
  );
}

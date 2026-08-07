import Image from "next/image";
import * as React from "react";

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function ProfilePicture({
  src = "/images/profile.png",
  alt = "Profile picture",
  size = 160,
  className = "",
}: ProfilePictureProps) {
  return (
    <div
      className={`w-[${size}px] h-[${size}px] sm:w-[192px] sm:h-[192px] rounded-full overflow-hidden ring-4 ring-lime-400/20 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-105"
        priority={false}
      />
    </div>
  );
}

export default ProfilePicture;

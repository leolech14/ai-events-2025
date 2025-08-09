"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(0, 0, 0)",
  gradientBackgroundEnd = "rgb(20, 20, 20)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    if (!interactive) return;
    
    const move = () => {
      if (!interactiveRef.current) return;
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
    };
    
    move();
  }, [tgX, tgY, curX, curY, interactive]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
        </defs>
      </svg>
      <div
        className={cn("", className)}
        style={{
          filter: "blur(40px)",
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `linear-gradient(to bottom right, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
        }}
      >
        <div
          className={cn(`absolute [filter:url(#blurMe)]`, {
            "blur-[100px]": isSafari,
          })}
          style={{
            background: `radial-gradient(circle at 20% 80%, rgba(${firstColor}, 0.6) 0%, transparent ${size})`,
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        />
        <div
          className={cn(`absolute [filter:url(#blurMe)]`, {
            "blur-[100px]": isSafari,
          })}
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(${secondColor}, 0.6) 0%, transparent ${size})`,
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        />
        <div
          className={cn(`absolute [filter:url(#blurMe)]`, {
            "blur-[100px]": isSafari,
          })}
          style={{
            background: `radial-gradient(circle at 80% 20%, rgba(${thirdColor}, 0.6) 0%, transparent ${size})`,
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        />
        <div
          className={cn(`absolute [filter:url(#blurMe)]`, {
            "blur-[100px]": isSafari,
          })}
          style={{
            background: `radial-gradient(circle at 80% 80%, rgba(${fourthColor}, 0.6) 0%, transparent ${size})`,
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        />
        <div
          className={cn(`absolute [filter:url(#blurMe)]`, {
            "blur-[100px]": isSafari,
          })}
          style={{
            background: `radial-gradient(circle at 20% 20%, rgba(${fifthColor}, 0.6) 0%, transparent ${size})`,
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        />
        {interactive && (
          <div
            ref={interactiveRef}
            className={cn(`absolute [filter:url(#blurMe)]`, {
              "blur-[100px]": isSafari,
            })}
            style={{
              background: `radial-gradient(circle at center, rgba(${pointerColor}, 0.8) 0%, transparent ${size})`,
              width: "100%",
              height: "100%",
              transform: "translate(-50%, -50%)",
              top: "50%",
              left: "50%",
              mixBlendMode: blendingValue as any,
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
};
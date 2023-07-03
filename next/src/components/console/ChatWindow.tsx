import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import PopIn from "../motions/popin";
import FadeIn from "../motions/FadeIn";
import HideShow from "../motions/HideShow";
import clsx from "clsx";
import { ChatMessage } from "./ChatMessage";
import type { HeaderProps } from "./MacWindowHeader";
import { MacWindowHeader, messageListId } from "./MacWindowHeader";
import { ExampleAgentButton } from "./ExampleAgentButton";
import { FaArrowCircleDown } from "react-icons/fa";
import { useAgentStore } from "../../stores";
import { getTaskStatus, TASK_STATUS_EXECUTING } from "../../types/task";
import { MESSAGE_TYPE_SYSTEM } from "../../types/message";
import { ImSpinner2 } from "react-icons/im";

interface ChatWindowProps extends HeaderProps {
  children?: ReactNode;
  scrollToBottom?: boolean;
  setAgentRun?: (name: string, goal: string) => void;
  visibleOnMobile?: boolean;
}

const ChatWindow = ({
  messages,
  children,
  title,
  setAgentRun,
  visibleOnMobile,
}: ChatWindowProps) => {
  const [t] = useTranslation();
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const isThinking = useAgentStore.use.isAgentThinking();
  const isStopped = useAgentStore.use.lifecycle() === "stopped";
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    // Use has scrolled if we have scrolled up at all from the bottom
    const hasUserScrolled = scrollTop < scrollHeight - clientHeight - 10;
    setHasUserScrolled(hasUserScrolled);
  };

  const handleScrollToBottom = (behaviour: "instant" | "smooth") => {
    if (!scrollRef || !scrollRef.current) return;

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: behaviour,
    });
  };

  useEffect(() => {
    if (!hasUserScrolled) {
      handleScrollToBottom("instant");
    }
  });

  return (
    <div
      className={clsx(
        "border-translucent h-full max-w-[inherit] flex-1 flex-col overflow-auto rounded-2xl border-2 border-white/20 bg-zinc-900 text-white shadow-2xl drop-shadow-lg transition-all duration-500",
        visibleOnMobile ? "flex" : "hidden xl:flex"
      )}
    >
      <HideShow
        showComponent={hasUserScrolled}
        className="absolute bottom-2 right-6 cursor-pointer"
      >
        <FaArrowCircleDown
          onClick={() => handleScrollToBottom("smooth")}
          className="h-6 w-6 animate-bounce md:h-7 md:w-7"
        />
      </HideShow>

      <MacWindowHeader title={title} messages={messages} />
      <div
        className="mb-2 mr-2 flex-1 overflow-auto transition-all duration-500"
        ref={scrollRef}
        onScroll={handleScroll}
        id={messageListId}
      >
        {messages.map((message, index) => {
          if (getTaskStatus(message) === TASK_STATUS_EXECUTING) {
            return null;
          }
          return (
            <FadeIn key={`${index}-${message.type}`}>
              <ChatMessage message={message} />
            </FadeIn>
          );
        })}
        {children}

        {messages.length === 0 && (
          <>
            <PopIn delay={0.8} duration={0.5}>
              <ChatMessage
                message={{
                  type: MESSAGE_TYPE_SYSTEM,
                  value:
                    "👉 Create an agent by adding a name / goal, and hitting deploy! Try our examples below!",
                }}
              />
              <div className="m-2 flex flex-col justify-between gap-2 sm:m-4 sm:flex-row">
                <ExampleAgentButton name="PlatformerGPT 🎮" setAgentRun={setAgentRun}>
                  Write some code to make a platformer game.
                </ExampleAgentButton>
                <ExampleAgentButton name="TravelGPT 🌴" setAgentRun={setAgentRun}>
                  Plan a detailed trip to Hawaii.
                </ExampleAgentButton>
                <ExampleAgentButton name="ResearchGPT 📜" setAgentRun={setAgentRun}>
                  Create a comprehensive report of the Nike company
                </ExampleAgentButton>
              </div>
            </PopIn>
          </>
        )}
        <div
          className={clsx(
            isThinking && !isStopped ? "opacity-100" : "opacity-0",
            "mx-2 flex flex-row items-center gap-2 rounded-lg border border-white/20 p-2 font-mono transition duration-300 sm:mx-4"
          )}
        >
          <p>🧠 Thinking</p>
          <ImSpinner2 className="animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

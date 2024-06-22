//@ts-nocheck @ts-ignore
"use client";

import Loader from "@/components/ui/Loader";
import MeetingCard from "@/components/ui/MeetingCard";
import { useGetCall } from "@/hooks/useGetCall";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  type: "ended" | "upcoming" | "recording";
}

const CallList = ({ type }: Props) => {
  const { endedCalls, upcomingCalls, isLoading, callRecordings } = useGetCall();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recording":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recording":
        return "no Recordings";
      case "upcoming":
        return "No Upcomings";
      default:
        return "";
    }
  };

  const calls = getCalls();
  const noCallSMessage = getNoCallsMessage();

  const handelClickMeetingCard = (meetingUrls) => {
    if (type == "recording") {
      router.push(`${meetingUrls}`);
    } else {
      router.push(`/meeting/${meeting.id}`);
    }
  };

  // effect
  useEffect(() => {
    console.log("get call");
    const fetchRecordings = async () => {
      console.log("get call222");
      const callData = await Promise.all(
        callRecordings.map((meeting) => meeting.queryRecordings())
      );
      console.log("call data --> ", callData);
      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);
      setRecordings(recordings);
    };

    if (type == "recording") {
      console.log("vao recording...");
      fetchRecordings();
    }
  }, [type, callRecordings]);

  console.log("isLoading ===", isLoading);
  if (isLoading) return <Loader />;

  return (
    <div>
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording, index) => (
          <MeetingCard
            icon={
              type == "ended"
                ? "/icons/previous.svg"
                : type == "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 26) ||
              meeting?.filename?.substring(0, 20) ||
              "Personal meeting" 
            }
            date={
              meeting.state?.startsAt.toLocaleString() ||
              meeting.start_time.toLocaleString()
            }
            isPreviousMeeting={false}
            buttonIcon1={
              type == "recording" ? "/icons/recordings.svg" : "/icons/play.svg"
            }
            handleClick={() => handelClickMeetingCard(meeting.url)}
            link={
              type == "recording"
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
            buttonText={type == "recording" ? "Play" : "Start"}
            key={index}
          />
        ))
      ) : (
        <h1>{noCallSMessage}</h1>
      )}
    </div>
  );
};

export default CallList;

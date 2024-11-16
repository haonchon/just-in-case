import { Avatar, useCallStateHooks } from "@stream-io/video-react-sdk";

export const MyParticipantsPanel = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  return (
    <div className="participants-panel">
      <h4>Participants</h4>
      {participants.map((participant) => {
        return (
          <div className="participant" key={participant.sessionId}>
            <Avatar imageSrc={participant.image} name={participant.name} />
            <div className="name">{participant.name}</div>
          </div>
        );
      })}
    </div>
  );
};

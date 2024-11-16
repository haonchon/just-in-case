import { useCallStateHooks } from '@stream-io/video-react-sdk';

export const MyDescriptionPanel = () => {
  const { useCallCustomData, useParticipants } = useCallStateHooks();
  const custom = useCallCustomData();
  const participants = useParticipants();
  return (
    <div className='description-panel'>
      <h2 className='title'>{custom?.title ?? '<Title>'}</h2>
      <h3 className='description'>{custom?.description ?? '<Description>'}</h3>
      <p className='participant-count'>{participants.length} participants</p>
    </div>
  );
};
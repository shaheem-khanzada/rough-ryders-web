import { Spinner } from 'react-bootstrap';

const ActivityIndicator = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '55vh',
      }}
    >
      <Spinner style={{ color: '#f4e8bb' }} animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default ActivityIndicator;
import PreviewBriefcase from "./PreviewBriefcase";

const ActionHistory = ({ documents }) => {
  return (
    <div className="ActionHistory">
      <PreviewBriefcase myStocks={documents} />
    </div>
  );
};

export default ActionHistory;

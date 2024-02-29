const Toast = ({ text }) => {
  return (
    <>
      {text && (
        <div className="border rounded-md p-3 animate-pulse">
          <p className="text-center  font-semibold ">{text}</p>
        </div>
      )}
    </>
  );
};

export default Toast;

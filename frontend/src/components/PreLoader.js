import ClipLoader from "react-spinners/ClipLoader";

function PreLoader() {
  return (
    <>
      <div className="preLoader">
        <ClipLoader
          color="var(--text-color)"
          cssOverride={{}}
          loading
          speedMultiplier={1}
          className="loader"
        />
      </div>
    </>
  );
}

export default PreLoader;

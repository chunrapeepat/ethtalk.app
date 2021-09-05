const LandingPage = () => {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://ethtalk.app/embed?url=https://ethtalk.app" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" id="ethtalk" width="100%" frameBorder="0"></iframe>`,
        }}
      />
    </>
  );
};

export default LandingPage;

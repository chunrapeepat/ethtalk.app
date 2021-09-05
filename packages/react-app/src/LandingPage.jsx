const LandingPage = () => {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://ethtalk.app/embed?url=https://ethtalk.app" width="100%" onload="setInterval(() => {this.style.height=(this.contentWindow.document.body.scrollHeight)+'px';}, 100)" frameBorder="0"></iframe>`,
        }}
      />
    </>
  );
};

export default LandingPage;

const LandingPage = () => {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<iframe width="100%" onload="setInterval(() => {this.style.height=(this.contentWindow.document.body.scrollHeight)+'px';}, 100)" frameBorder="0" src="http://localhost:3000/embed"></iframe>`,
        }}
      />
    </>
  );
};

export default LandingPage;

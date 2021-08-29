const LandingPage = () => {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<iframe width="100%" onload="this.style.height=(this.contentWindow.document.body.scrollHeight)+'px';" frameBorder="0" src="http://localhost:3000/embed"></iframe>`,
        }}
      />
    </>
  );
};

export default LandingPage;

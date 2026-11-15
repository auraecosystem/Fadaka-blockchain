t := uritemplate.MustNew("https://example.org:9494/masque?h={target_host}&p={target_port}")
// ... error handling
var proxy masque.Proxy
http.Handle("/masque", func(w http.ResponseWriter, r *http.Request) {
  // parse the UDP proxying request
  mreq, err := masque.ParseRequest(r, t)
  if err != nil {
    if perr, ok := errors.AsType[*masque.RequestParseError](err); ok {
      w.WriteHeader(perr.HTTPStatus)
      return
    }
    w.WriteHeader(http.StatusBadRequest)
    return
  }

  // optional: whitelisting / blacklisting logic

  // start proxying UDP datagrams back and forth
  err = proxy.Proxy(w, mreq)
  // ... error handling
}

// set up HTTP/3 server on :4443
s := http3.Server{Addr: ":9494"}
s.ListenAndServeTLS(<certfile>, <keyfile>)

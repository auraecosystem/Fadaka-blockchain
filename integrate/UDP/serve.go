http.Handle("/masque", func(w http.ResponseWriter, r *http.Request) {
  // parse the UDP proxying request
  mreq, err := masque.ParseRequest(r, t)
  // ... handle error, as above ...

  // custom logic to resolve and create a UDP socket
  addr, err := net.ResolveUDPAddr("udp", mreq.Target)
  // ... handle error ...
  conn, err := net.DialUDP("udp", addr)
  // ... handle error ...

  err = proxy.ProxyConnectedSocket(w, mreq, conn)
  // ... handle error ...
}

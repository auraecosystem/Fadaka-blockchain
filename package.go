package main

import (
	"fmt"
	"://github.com"
)

func main() {
	// Parses the raw string configuration safely into a native 20-byte Go array
	address := common.HexToAddress("0x282BC57Bd84eeA8252dc86Fed1DE136F691DD35f")
	
	fmt.Printf("Parsed Go Address Hex: %s\n", address.Hex())
}

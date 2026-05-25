# frozen_string_literal: true

class FadakaNode < Formula
  desc "Fadaka blockchain full node and CLI"
  homepage "https://github.com/Web4application/fadaka-blockchain"
  url "https://github.com/Web4application/fadaka-blockchain/archive/refs/tags/v1.2.0.tar.gz"
  sha256 "REPLACE_WITH_REAL_SHA256"
  license "MIT"
  head "https://github.com/Web4application/fadaka-blockchain.git", branch: "main"

  depends_on "go" => :build

  livecheck do
    url :stable
    strategy :github_latest
  end

  def install
    commit = if build.head?
      Utils.git_short_head
    else
      "release"
    end

    ldflags = %W[
      -s
      -w
      -X main.Version=#{version}
      -X main.Commit=#{commit}
    ]

    system "go", "build", *std_go_args(ldflags: ldflags), "./cmd/fadaka"

    generate_completions_from_executable(bin/"fadaka", "completion")
  end

  service do
    run [opt_bin/"fadaka", "node"]
    keep_alive true

    log_path var/"log/fadaka-node.log"
    error_log_path var/"log/fadaka-node.err.log"
  end

  test do
    output = shell_output("#{bin}/fadaka --help")
    assert_match "Fadaka", output
  end
end

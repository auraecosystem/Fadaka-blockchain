{ modulesPath, ... }:
{
  imports = [ (modulesPath + "/installer/netboot/netboot-minimal.nix") ];

  services.openssh.enable = true;
  users.users.root.openssh.authorizedKeys.keys = [ "my-ssh-pubkey" ];
}
nix-build '<nixpkgs/nixos>' \
  --arg configuration ./configuration.nix
  --attr config.system.build.kexecTree

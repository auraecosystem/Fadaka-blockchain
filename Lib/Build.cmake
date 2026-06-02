# Clone and build LLVM (specific commit)
git clone https://github.com/llvm/llvm-project.git
cd llvm-project && git checkout dc4cef81d47c...
cmake -S llvm -B build -DCMAKE_BUILD_TYPE=Release ...
cmake --build build
cmake --install build
cd ..

# Download and build Duktape
curl -L https://github.com/.../duktape-2.7.0.tar.xz | tar xJ
cmake -S duktape -B duktape/build ...
cmake --build duktape/build
cmake --install duktape/build

# Repeat for libxml2, Lua...
# Then configure MrDocs with all the install paths
cmake -S mrdocs -B mrdocs/build \
  -DLLVM_ROOT=/path/to/llvm/install \
  -Dduktape_ROOT=/path/to/duktape/install \
  -Dlibxml2_ROOT=/path/to/libxml2/install \
  ...
cmake --build mrdocs/build

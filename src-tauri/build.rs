use std::{env, path::PathBuf};

fn main() {
    let mut attributes = tauri_build::Attributes::new();
    let target_os = env::var("CARGO_CFG_TARGET_OS").unwrap();
    let target_env = env::var("CARGO_CFG_TARGET_ENV").unwrap();

    if target_os == "windows" && target_env == "msvc" {
        attributes = attributes
            .windows_attributes(tauri_build::WindowsAttributes::new_without_app_manifest());
        let manifest_path = PathBuf::from(env::var_os("CARGO_MANIFEST_DIR").unwrap())
            .join("windows-app-manifest.xml");
        let manifest = manifest_path.display();

        // Include unit-test binaries: https://github.com/tauri-apps/tauri/issues/13419#issuecomment-3398457618
        println!("cargo:rerun-if-changed={manifest}");
        println!("cargo:rustc-link-arg=/MANIFEST:EMBED");
        println!("cargo:rustc-link-arg=/MANIFESTINPUT:{manifest}");
    }

    tauri_build::try_build(attributes).expect("Failed to run tauri-build");
}

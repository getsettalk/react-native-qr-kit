Pod::Spec.new do |s|
  s.name         = "react-native-qr-kit"
  s.version      = "1.0.1"
  s.summary      = "React Native QR scanner"
  s.description  = "Cross-platform QR Code scanning/generation for React Native"
  s.homepage     = "https://github.com/yourusername/react-native-qr-kit"
  s.license      = "MIT"
  s.author       = { "Your Name" => "rajrock7254@gmail.com" }
  
  s.platform     = :ios, "11.0"
  s.source       = { :git => "https://github.com/getsettalk/react-native-qr-kit.git", :tag => "#{s.version}" }
  s.source_files = ["ios/**/*.{h,m}", "ios/QRKitModule.swift"]
  s.requires_arc = true
  s.swift_version = "5.0"

  s.dependency "React-Core"
end
interface LaunchParams {
    files: FileSystemFileHandle[];
}

interface LaunchQueue {
    setConsumer(consumer: (launchParams: LaunchParams) => any): void;
}

interface Window {
    launchQueue: LaunchQueue;
}

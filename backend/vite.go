package backend

import (
	"fmt"
	"os"

	"github.com/nixpare/process"
)

func startVite() (*process.Process, error) {
	proc, err := process.NewProcess("", "npm", "run", "dev")
	if err != nil {
		return nil, err
	}

	err = proc.Start(nil, os.Stdout, os.Stderr)
	if err != nil {
		return proc, err
	}

	fmt.Println("Vite started")
	return proc, err
}

func stopVite(proc *process.Process) error {
	if !proc.IsRunning() {
		return nil
	}

	err := proc.Stop()
	if err != nil {
		return err
	}

	/* exitStatus := proc.Wait()
	if err = exitStatus.Error(); err != nil {
		return err
	} */

	fmt.Println("Vite stopped")
	return nil
}

import importlib
import os
import sys
import tempfile
from pathlib import Path
import unittest


class DatabasePathTests(unittest.TestCase):
    def test_database_uses_project_root_path(self):
        project_root = Path(__file__).resolve().parents[1]
        backend_dir = project_root / "backend"
        expected_db = project_root / "smartfactory.db"

        if expected_db.exists():
            expected_db.unlink()

        with tempfile.TemporaryDirectory() as temp_dir:
            original_cwd = os.getcwd()
            os.chdir(temp_dir)
            try:
                sys.path.insert(0, str(project_root))
                sys.modules.pop("backend.database", None)
                import backend.database as database_module
                importlib.reload(database_module)
                database_module.db.init_db()
            finally:
                os.chdir(original_cwd)
                sys.modules.pop("backend.database", None)

        self.assertTrue(expected_db.exists(), "Database should be created in the project root regardless of the current working directory")


if __name__ == "__main__":
    unittest.main()

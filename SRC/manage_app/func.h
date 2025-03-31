using namespace std;

bool noConsecutivePeriods(const std::string& input) {
    for (size_t i = 0; i < input.length() - 1; i++) {
        if (input[i] == '.' && input[i + 1] == '.') {
            return false;
        }
    }
    return true;
}
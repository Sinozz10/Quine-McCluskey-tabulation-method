# Boolean Minimizer - Quine-McCluskey Method

A web-based Boolean function minimizer that implements the Quine-McCluskey tabulation method to find the minimal sum-of-products (SOP) form of Boolean expressions.

## 🚀 Features

- **Interactive Web Interface**: Clean, responsive design that works on desktop and mobile
- **Quine-McCluskey Algorithm**: Systematic method for Boolean function minimization
- **Prime Implicant Generation**: Automatically finds all prime implicants
- **Essential Prime Implicant Detection**: Identifies essential prime implicants
- **Don't Care Term Support**: Handles don't care conditions for further optimization
- **Auto-generated Variable Names**
- **Real-time Validation**: Input validation with helpful error messages
- **Detailed Results**: Shows step-by-step minimization process with tables

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server-side processing required
- No external dependencies

## 🎯 Usage

### Basic Steps

1. **Set Number of Variables**: Choose between 2-10 variables
2. **Enter Minterms**: Comma-separated list of decimal numbers representing minterms
3. **Enter Don't Cares** (Optional): Comma-separated list of don't care terms
4. **Click Calculate**: Get the minimized Boolean expression


### Input Format

- **Minterms**: `0,1,3,7` (decimal representation)
- **Don't Cares**: `2,5` (optional, can be empty)
- **Variables**: Automatically generated (A, B, C, D, ...)

## 🔧 How It Works

The application implements the Quine-McCluskey method through these steps:

1. **Convert to Binary**: Transform decimal minterms to binary representation
2. **Group by 1s**: Group terms by number of 1s in binary representation
3. **Find Adjacent Groups**: Combine terms that differ by exactly one bit
4. **Generate Prime Implicants**: Repeat until no more combinations possible
5. **Find Essential Prime Implicants**: Identify prime implicants that cover unique minterms
6. **Select Minimal Cover**: Choose minimum set of prime implicants

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **Vanilla JavaScript**: Core logic implementation
- **ES6+**: Modern JavaScript features

### Algorithm Complexity
- **Time Complexity**: O(3^n) in worst case
- **Space Complexity**: O(2^n) for storing terms
- **Practical Limit**: Up to 10 variables for reasonable performance

## 💡 Usage Notes

The tool automatically generates variable names:
- First 26 variables: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
- Additional variables: A0, A1, A2, B0, B1, B2, etc.

## 🔍 Validation Rules

- Minimum 2 variables required
- Maximum 10 variables (performance limit)
- Terms must be within valid range (0 to 2^n - 1)
- No overlap between minterms and don't cares
- At least one minterm required

## 🎓 Educational Value

This tool is perfect for:
- **Digital Logic Courses**: Understanding Boolean minimization
- **Computer Science Students**: Learning optimization algorithms
- **Engineers**: Quick Boolean function simplification
- **Self-Learning**: Interactive exploration of the Quine-McCluskey method

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Quine-McCluskey algorithm inventors
- Digital logic design community
- Web development best practices

---

*This tool provides an interactive way to understand Boolean function minimization using the systematic Quine-McCluskey method. Perfect for students, educators, and professionals working with digital logic design.*

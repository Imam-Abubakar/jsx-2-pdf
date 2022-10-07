import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import JsPdf from 'jspdf';

class Jsx2Pdf extends PureComponent {
  constructor(props) {
    super(props);
    this.pdfConvert = this.pdfConvert.bind(this);
    this.mainRef = React.createRef();
  }

  pdfConvert() {
    const { mainRef, filename, width, height, options, onRender } = this.props;
    const source = mainRef || this.mainRef;
    const targetComponent = source.current || source;
    if (!targetComponent) {
      throw new Error(
        'Ref must be specified'
      );
    }
    html2canvas(targetComponent, {
      logging: false,
      useCORS: true,
      scale: this.props.scale
    }).then(canvas => {
      const imgSource = canvas.toDataURL();
      const pdf = new JsPdf(options);
      pdf.addImage(imgSource, 'JPEG', x, y);
      pdf.save(filename);
      if (onRender) onComplete();
    });
  }

  render() {
    const { children } = this.props;
    return children({ pdfConvert: this.pdfConvert, mainRef: this.mainRef });
  }
}

Jsx2Pdf.propTypes = {
  filename: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  options: PropTypes.shape({}),
  scale: PropTypes.number,
  children: PropTypes.func.isRequired,
  onRender: PropTypes.func,
  mainRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

Jsx2Pdf.defaultProps = {
  filename: 'file.pdf',
  options: undefined,
  width: 0,
  height: 0,
  scale: 1,
  onRender: undefined,
  mainRef: undefined
};

export default Jsx2Pdf;
